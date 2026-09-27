import logging
from django.db import connection
from django.core.management.color import no_style

logger = logging.getLogger(__name__)

def reset_db_sequences():
    """
    Synchronizes primary key sequences in PostgreSQL / Neon.
    When data is seeded or imported with explicit IDs, PostgreSQL sequences
    do not advance automatically, causing nextval() to start from 1 and fail
    with duplicate key violations.
    """
    from .models import User, Department, Complaint, ComplaintUpdate, Attachment, Feedback

    models = [User, Department, Complaint, ComplaintUpdate, Attachment, Feedback]

    if connection.vendor == 'postgresql':
        try:
            with connection.cursor() as cursor:
                sequence_sql = connection.ops.sequence_reset_sql(no_style(), models)
                for sql in sequence_sql:
                    try:
                        cursor.execute(sql)
                    except Exception:
                        pass

                for model in models:
                    table = model._meta.db_table
                    try:
                        cursor.execute(f"""
                            SELECT setval(
                                pg_get_serial_sequence('"{table}"', 'id'),
                                COALESCE((SELECT MAX(id) FROM "{table}"), 1)
                            );
                        """)
                    except Exception as err:
                        logger.warning(f"Could not reset sequence for {table}: {err}")

            logger.info("Successfully reset PostgreSQL primary key sequences.")
            return True
        except Exception as e:
            logger.error(f"Failed to reset PostgreSQL sequences: {e}")
            return False
    return True
